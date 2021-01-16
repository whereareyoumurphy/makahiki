<template>
  <div>
    <div class="post">
      <h4><i class="fas fa-info-circle"></i> Categories Overview</h4>
      
    </div>
    <div v-if="incomingCategories.length" class="post">
      <div>Total incoming monthly budget : £{{incomingCategoriesBudget}}</div>
    </div>
    <div v-if="outgoingCategories.length" class="post">
      <div>Total outgoing monthly budget : £{{outgoingCategoriesBudget}}</div>
    </div>
    <div class="post">
      <strong style="color: green;" v-if="categoriesTotal > 0">Expected monthly savings : £{{categoriesTotal}}</strong>
      <strong style="color: red;" v-if="categoriesTotal < 0">Expected monthly loss : £{{categoriesTotal}}</strong>
      <strong v-if="categoriesTotal == 0">You are expected to break even each month</strong>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      
    }
  },
  computed: {
    ...mapState(['userProfile']),
    ...mapState(['incomingCategories']),
    ...mapState(['outgoingCategories']),

    incomingCategoriesBudget() {
      let budget = 0
      this.incomingCategories.forEach(category => {
        budget += category.budget;
      })
      return budget
    },

    outgoingCategoriesBudget() {
      let budget = 0
      this.outgoingCategories.forEach(category => {
        budget += category.budget;
      })
      return budget
    },

    categoriesTotal() {
      let total = this.incomingCategoriesBudget - this.outgoingCategoriesBudget;
      return total;
    }

  },
  methods: {

  }
}
</script>