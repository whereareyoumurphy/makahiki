<template>
  <div id="categories">
    <section>
      <div class="col1">
        <div class="profile">
          <!--Add a year menu component-->
          <h5>{{ $route.params.year }}</h5>
          <ul role="navigation">
            <li><a href="#">{{ $route.params.year }} Overview</a></li>
            <li v-for="month in currentYear.months"  :key="month.id">
              <router-link v-bind:to="'/month/' + $route.params.year + '/' + month.id">{{month.name}}</router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="col2">
        {{currentYear}}
      </div>
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
  created() {
    this.$store.dispatch('fetchCurrentYear', this.$route.params.year)
  },
  destroyed() {

    this.$store.dispatch('clearCurrentYear', this.$route.params.year)

  },
  computed: {
    ...mapState(['userProfile']),
    ...mapState(['currentYear'])
  },
  methods: {
  }
}
</script>