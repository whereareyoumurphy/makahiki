<template>
  <div id="categories">
    <section>
      <div>Year :: {{ $route.params.year }}</div>
      <div>Month :: {{ $route.params.month }}</div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {

  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['userProfile'])
  },
  methods: {
  }
}
</script>