<template>
  <div id="categories">
    <section>
      <div class="col1">
        <CreateCategoryForm></CreateCategoryForm>
      </div>
      <div class="col2">

        <CategoriesOverview></CategoriesOverview>

        <br />

        <IncomingCategoryList></IncomingCategoryList>

        <br />

        <OutgoingCategoryList></OutgoingCategoryList>

      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CategoriesOverview from '@/components/CategoriesOverview'
import CreateCategoryForm from '@/components/CreateCategoryForm'
import IncomingCategoryList from '@/components/IncomingCategoryList'
import OutgoingCategoryList from '@/components/OutgoingCategoryList'

export default {
  components: {
    CreateCategoryForm,
    IncomingCategoryList,
    OutgoingCategoryList,
    CategoriesOverview
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