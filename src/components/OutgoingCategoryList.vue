<template>
  <div>
    <div class="post">
      <h4><i class="fas fa-outdent"></i> Outgoing Categories</h4>
    </div>
    <div v-if="outgoingCategories.length">
      <CategoryListItem v-for="category in outgoingCategories" :key="category.id" v-bind:category-type="'outgoing-categories'" v-bind:category="category" />
    </div>
    <div v-else>
      <p class="no-results">There are currently no outgoing categories</p>
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
    ...mapState(['outgoingCategories'])
  },
  methods: {

  }
}
</script>