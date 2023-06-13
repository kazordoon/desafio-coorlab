<template>
  <div class="title">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand class="ml-2">
        <b>{{ appName }}</b>
      </b-navbar-brand>
    </b-navbar>

    <div>
      <form>
        <div>
          <label for="destination">Destino</label>
          <select name="destination" id="destination">
            <option value="" selected disabled>Selecione o destino</option>
            <option v-for="destination in destinations" :key="destination" :value="destination">{{ destination }}</option>
          </select>
        </div>
        <div>
          <label for="weight">Peso</label>
          <input type="text" />
        </div>
        <button>Analisar</button>
      </form>
    </div>
  </div>
</template>

<script>
import {
  BNavbar,
  BNavbarBrand,
} from 'bootstrap-vue'
import Request from '../helpers/Request.js'

export default {
  components: {
    BNavbar,
    BNavbarBrand,
  },
  data() {
    const appName = ''
    const destinations = []

    return {
      appName,
      destinations
    }
  },
  async created() {
    // Implemente aqui o GET dos dados da API REST
    // para que isso ocorra na inicialização da pagina
    this.appName = 'Melhor Frete'

    const API_URL = 'http://localhost:3000/transport'
    const freightTypes = await Request.GET(API_URL)

    freightTypes.forEach(freight => {
      if (!(freight.city in this.destinations))
        this.destinations.push(freight.city)

      this.destinations = [...(new Set(this.destinations))]
    })

  },
  methods: {
    // Implemente aqui os metodos utilizados na pagina
    methodFoo() {
      console.log(this.appName)
    },
  },
}
</script>

<style scoped>
.title .navbar {
  background-color: #00aca6 !important;
}

.title .navbar-brand {
  margin-left: 20px;
}
</style>
