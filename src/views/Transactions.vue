<template>
  <div id="categories">
    <section>
      <div class="col2">
        <h3>Outgoing Transactions</h3><br />
        <CreateOutgoingTransactionForm></CreateOutgoingTransactionForm>
      </div>
      <div class="col2">
        <h3>Incoming Transactions</h3><br />
        <CreateIncomingTransactionForm></CreateIncomingTransactionForm>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CreateIncomingTransactionForm from '@/components/CreateIncomingTransactionForm'
import CreateOutgoingTransactionForm from '@/components/CreateOutgoingTransactionForm'

export default {
  components: {
    CreateOutgoingTransactionForm,
    CreateIncomingTransactionForm    
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