<template>
<div>
  <div class="post">
    <h5>{{category.name}} <a @click="edit()"><i class="fas fa-pencil-alt"></i></a></h5>
    <span v-if="category.updatedOn">{{ category.updatedOn | formatDate }}</span>
    <span v-else>{{ category.createdOn | formatDate }}</span>
    <p>{{ category.description | trimLength }}</p>
    <ul>
      <li v-if="category.budget">Monthly budget : <strong>£{{ category.budget }}</strong></li>
      <li>Transactions : <strong>{{ category.transactions }}</strong></li>
    </ul>
  </div>
  <EditCategoryModal @close="closeEditModal" v-bind:category="category" v-bind:category-type="categoryType" v-bind:show="showEditModal"></EditCategoryModal>
</div>
</template>

<script>
import moment from 'moment'
import EditCategoryModal from '@/components/EditCategoryModal'

export default {
  components: {
    EditCategoryModal
  },
  props: ['category', 'categoryType'],
  data() {
      return {
        showEditModal: false
      }
  },
  methods: {
    edit() {
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    }
  },
  filters: {
    formatDate(val) {
      if (!val) { return '-' }
      let date = val.toDate()
      return moment(date).fromNow()
    },
    trimLength(val) {
      if (val.length < 200) { return val }
      return `${val.substring(0, 200)}...`
    }
  }
}
</script>