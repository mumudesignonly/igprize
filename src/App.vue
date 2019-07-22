<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase title_bar">
        <v-btn icon><v-icon medium>fab fa-instagram</v-icon></v-btn>
        <span>IG藏寶庫</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn> -->
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    // HelloWorld
  },
  data () {
    return {
      //
    }
  }
}
</script>
<style lang="sass">
  @import '@/assets/sass/reset.scss'
  @import '@/assets/sass/main.sass'
</style>
<style lang="sass" scoped>
.title_bar 
  span
    letter-spacing: 2px
    vertical-align: middle
  button
    margin: 0
</style>

