<template>

  <transition name="fade">
      <div v-if="show" class="p-modal">
        <div class="p-container">
          <a @click="close()" class="close">close</a>
          <div class="post">
            <div class="profile">
                <h4><i class="fas fa-pencil-alt"></i> Edit a Category</h4>
                <div class="create-post">
                  <form @submit.prevent>
                    <label for="name">Name <small>(required)</small></label>
                    <p class="invalid" v-if="!isFieldValid('name')">{{fieldValidationMessage('name')}}</p>
                    <input id="name" type="text" v-model.trim="category.name" />
                    
                    <label for="description">Description</label>
                    <p class="invalid" v-if="!isFieldValid('description')">{{fieldValidationMessage('description')}}</p>
                    <textarea id="description" v-model.trim="category.description"></textarea>
                    
                    <label for="budget">Monthly Budget</label>
                    <p class="invalid" v-if="!isFieldValid('budget')">{{fieldValidationMessage('budget')}}</p>
                    <input id="budget" type="number" v-model.trim="category.budget" />

                    <button @click="submit()" class="button">update</button>
                  </form>
                </div>
              </div>

          </div>
        </div>
      </div>
    </transition>

</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['categoryType', 'category', 'show'],
  data() {
    return {
      categoryValidation: [],
    }
  },
  methods: {

    close() {
      this.$emit('close')
    },

    isFieldValid(fieldName){

      var valid = true

      this.categoryValidation.forEach(element => {
        if (fieldName === element.field) {
          valid = false
        }
      });

      return valid

    },

    fieldValidationMessage (fieldName) {

      var message = ''

      this.categoryValidation.forEach(element => {
        if (fieldName === element.field) {
          message += (element.message + '. ')
        }
      });

      return message

    },

    submit() {

      // do validation first
      this.categoryValidation = []

      if (this.category.name === '') {
        this.categoryValidation.push({field: 'name', message: 'Name is mandatory'})
      }

      if (this.category.budget === null || isNaN(this.category.budget) || this.category.budget <= 0) {
        this.categoryValidation.push({field: 'budget', message: 'Budget must be greater than £0'})
      }

      if (this.categoryValidation.length > 0) {
        return
      } else {

        // logic to update the category
        this.$store.dispatch('updateCategory', {id: this.category.id, categoryType: this.categoryType, categoryData: this.category})

        this.close();

      }
    }
  }
}
</script>