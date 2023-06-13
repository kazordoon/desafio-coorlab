<template>
  <div class="title">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand class="ml-2">
        <b>{{ appName }}</b>
      </b-navbar-brand>
    </b-navbar>
    <div>
      <form @submit="checkForm">
        <div>
          <label for="destination">Destino</label>
          <select v-model="destination" name="destination" id="destination">
            <option value="" selected disabled>Selecione o destino</option>
            <option v-for="destination in destinations" :key="destination" :value="destination">{{ destination }}</option>
          </select>
        </div>
        <div>
          <label for="weight">Peso</label>
          <input @keyup="allowOnlyNumbers" v-model="weight" type="text" />Kg
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
import FreightValidator from '../validators/FreightValidator.js'

export default {
  components: {
    BNavbar,
    BNavbarBrand,
  },
  data() {
    const appName = ''
    const destinations = []
    const destination = ''
    const weight = ''

    return {
      appName,
      destinations,
      destination,
      weight
    }
  },
  async created() {
    // Implemente aqui o GET dos dados da API REST
    // para que isso ocorra na inicialização da pagina
    this.appName = 'Melhor Frete'

    const API_URL = 'http://localhost:3000/transport'
    const freightTypes = await Request.GET(API_URL)

    freightTypes.forEach(freight => {
      if (!this.destinations.includes(freight.city))
        this.destinations.push(freight.city)

      this.destinations = [...(new Set(this.destinations))]
    })
  },
  methods: {
    // Implemente aqui os metodos utilizados na pagina
    allowOnlyNumbers() {
      this.weight = this.weight.replace(/\D/g, '').replace(/(\d{1,})/g, '$1')
    },
    checkForm(event) {
      event.preventDefault()

      const freightValidator = new FreightValidator()

      freightValidator.validate(this.destination, this.weight)

      if (freightValidator.validationError) {
        alert(freightValidator.validationError)
      }
    }
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
