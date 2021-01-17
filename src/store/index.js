import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'
import DatesUtilities from '@/utilities/dates.js'

Vue.use(Vuex)

// realtime firebase
// fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
//   let postsArray = []

//   snapshot.forEach(doc => {
//     let post = doc.data()
//     post.id = doc.id

//     postsArray.push(post)
//   })

//   store.commit('setPosts', postsArray)
// })

var postsListenerUnsubscribe = function () {};
var incomingCategoriesListenerUnsubscribe = function () {};
var outgoingCategoriesListenerUnsubscribe = function () {};
var yearsListenerUnsubscribe = function () {};


const store = new Vuex.Store({
  state: {
    userProfile: {},
    posts: [],
    years: [],
    incomingCategories: [],
    outgoingCategories: []
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val
    },
    setPerformingRequest(state, val) {
      state.performingRequest = val
    },
    setPosts(state, val) {
      state.posts = val
    },
    setIncomingCategories(state, val) {
      state.incomingCategories = val
    },
    setOutgoingCategories(state, val) {
      state.outgoingCategories = val
    },
    setYears(state, val) {
      state.years = val
    }
  },
  actions: {

    async logout({ commit }) {
      // log user out
      await fb.auth.signOut()

      // clear user data from state
      commit('setUserProfile', {})

      // redirect to login view
      router.push('/login')
    },

    async login({ dispatch }, form) {
      // sign user in
      const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)

      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
      dispatch('fetchUserPosts', user)
      dispatch('fetchUserCategories')
      dispatch('fetchUserYears')
    },

    async signup({ dispatch }, form) {
      // sign user up
      const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)

      // create user object in userCollections
      await fb.usersCollection.doc(user.uid).set({
        name: form.name,
        title: form.title
      })

      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },

    async updateProfile({ dispatch }, user) {
      const userId = fb.auth.currentUser.uid
      // update user object
      const userRef = await fb.usersCollection.doc(userId).update({
        name: user.name,
        title: user.title
      })

      dispatch('fetchUserProfile', { uid: userId })

      // update all posts by user
      const postDocs = await fb.postsCollection.where('userId', '==', userId).get()
      postDocs.forEach(doc => {
        fb.postsCollection.doc(doc.id).update({
          userName: user.name
        })
      })

      // update all comments by user
      const commentDocs = await fb.commentsCollection.where('userId', '==', userId).get()
      commentDocs.forEach(doc => {
        fb.commentsCollection.doc(doc.id).update({
          userName: user.name
        })
      })
    },

    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get()

      // set user profile in state
      commit('setUserProfile', userProfile.data())

      // change route to dashboard
      if (router.currentRoute.path === '/login') {
        router.push('/')
      }
    },

    async fetchUserPosts({ commit }, user) {

      // Kill existing listener if there is one
      postsListenerUnsubscribe();

      // create a listener
      postsListenerUnsubscribe = fb.postsCollection
        .where('userId', '==', user.uid)
        .orderBy('createdOn', 'desc')
        .onSnapshot(snapshot => {

        let postsArray = []

        snapshot.forEach(doc => {
          let post = doc.data()
          post.id = doc.id
      
          postsArray.push(post)
        })

        store.commit('setPosts', postsArray)
      })

    },

    async createPost({ state, commit }, post) {
      // create post in firebase
      await fb.postsCollection.add({
        createdOn: new Date(),
        content: post.content,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        comments: 0,
        likes: 0
      })
    },

    async likePost ({ commit }, post) {
      const userId = fb.auth.currentUser.uid
      const docId = `${userId}_${post.id}`

      // check if user has liked post
      const doc = await fb.likesCollection.doc(docId).get()
      if (doc.exists) { return }

      // create post
      await fb.likesCollection.doc(docId).set({
        postId: post.id,
        userId: userId
      })

      // update post likes count
      fb.postsCollection.doc(post.id).update({
        likes: post.likesCount + 1
      })
    },

    async createCategory({ state, commit }, category) {

      const userId = fb.auth.currentUser.uid

      await fb.usersCollection.doc(userId).collection(category.transactionType).add({
        createdOn: new Date(),
        userId: fb.auth.currentUser.uid,
        name: category.name,
        description: category.description,
        budget: Number(category.budget),
        transactions: 0
        // icon
        // colour etc
      })

    },

    async fetchUserCategories({ commit }) {

      // Kill existing listener if there is one
      incomingCategoriesListenerUnsubscribe()
      outgoingCategoriesListenerUnsubscribe()

      const userId = fb.auth.currentUser.uid

      // create a listener
      incomingCategoriesListenerUnsubscribe = fb.usersCollection.doc(userId).collection('incoming-categories')
        .orderBy('name', 'asc')
        .onSnapshot(snapshot => {

        let categoriesArray = []

        snapshot.forEach(doc => {
          let category = doc.data()
          category.id = doc.id
      
          categoriesArray.push(category)
        })

        store.commit('setIncomingCategories', categoriesArray)
      })

      outgoingCategoriesListenerUnsubscribe = fb.usersCollection.doc(userId).collection('outgoing-categories')
        .orderBy('name', 'asc')
        .onSnapshot(snapshot => {

        let categoriesArray = []

        snapshot.forEach(doc => {
          let category = doc.data()
          category.id = doc.id
      
          categoriesArray.push(category)
        })

        store.commit('setOutgoingCategories', categoriesArray)
      })

    },

    async updateCategory({ dispatch }, category) {

      const userId = fb.auth.currentUser.uid
      
      // update user object
      const userRef = await fb.usersCollection.doc(userId).collection(category.categoryType).doc(category.id).update({
        name: category.categoryData.name,
        description: category.categoryData.description,
        budget: Number(category.categoryData.budget),
        updatedOn: new Date(),
      })

      dispatch('fetchUserCategories', { uid: userId })

    },

    async createTransaction({ dispatch, state }, transaction) {

      const userId = fb.auth.currentUser.uid
      const transactionYear = transaction.date.getFullYear()
      const transactionMonth = transaction.date.getMonth() + 1
      const yearRefId = '' + transactionYear
      const monthRefId = '' + transactionMonth

      // Create the year record if it doesn't already exist
      let yearRef = await fb.usersCollection.doc(userId)
        .collection('years').doc(yearRefId)
        .get()

      if (!yearRef.exists) {
        
        await fb.usersCollection.doc(userId).collection('years').doc(yearRefId).set({
          name : transactionYear
        })

        dispatch('fetchUserYears')

      }

      //  Create the month record if it doesn't already exist
      let monthRef = await fb.usersCollection.doc(userId)
        .collection('years').doc(yearRefId)
        .collection('months').doc(monthRefId)
        .get()

      if (!monthRef.exists) {

        await fb.usersCollection.doc(userId)
          .collection('years').doc(yearRefId)
          .collection('months').doc(monthRefId)
          .set({
            name: DatesUtilities.getMonthName(transaction.date)
        })

      }

      // Finally we can create the transaction
      await fb.usersCollection.doc(userId)
          .collection('years').doc(yearRefId)
          .collection('months').doc(monthRefId)
          .collection(transaction.transactionType).add({
            date: transaction.date,
            categoryId: transaction.categoryId,
            amount: transaction.amount,
            note: '' +  transaction.note
          })

    },

    async fetchUserYears({ commit }) {

      // Kill existing listener if there is one
      yearsListenerUnsubscribe()

      const userId = fb.auth.currentUser.uid

      // create a listener
      yearsListenerUnsubscribe = fb.usersCollection.doc(userId).collection('years')
        .orderBy('name', 'asc')
        .onSnapshot(snapshot => {

        let yearsArray = []

        snapshot.forEach(doc => {
          let year = doc.data()
          year.id = doc.id
      
          yearsArray.push(year)
        })

        console.log('fetchUserYears', yearsArray);

        store.commit('setYears', yearsArray)
      })

    },

  }
})

export default store