<template>
  <div>
    <div class="post">
      <h4><i class="fas fa-indent"></i> Incoming Categories</h4>
    </div>
    <div v-if="incomingCategories.length">
      <CategoryListItem v-for="category in incomingCategories" :key="category.id" v-bind:category-type="'incoming-categories'" v-bind:category="category" />
    </div>
    <div v-else>
      <p class="no-results">There are currently no incoming categories</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CategoryListItem from '@/components/CategoryListItem'

export default {
  components: {
    CategoryListItem
  },
  data() {
    return {
      
    }
  },
  computed: {
    ...mapState(['incomingCategories'])
  },
  methods: {

  }
}
</script>