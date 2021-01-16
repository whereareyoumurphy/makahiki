<template>
  <header>
    <section>
      <div class="col1">
        <router-link to="/">
          <h3><i class="fas fa-money-bill-wave"></i> Makahiki</h3>
        </router-link>
        <ul class="inline">
          <li>
            <router-link to="/">Dashboard</router-link>
          </li>
          <li>
            <router-link to="/transactions">Transactions</router-link>
          </li>
          <li>
            <router-link to="/categories">Categories</router-link>
          </li>
          <li>
            <router-link to="/account">Account</router-link>
          </li>
          <li><a @click="logout()">Logout</a></li>
        </ul>
      </div>
    </section>
  </header>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>