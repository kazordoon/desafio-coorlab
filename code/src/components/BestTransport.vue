<template>
  <div class="title">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand class="ml-2">
        <b>{{ appName }}</b>
      </b-navbar-brand>
    </b-navbar>
    <div id="freight-form">
      <form @submit="checkForm">
        <h4>Insira o destino e o peso</h4>
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
import NumberFormatter from '../helpers/NumberFormatter.js'
import FreightValidator from '../validators/FreightValidator.js'

export default {
  components: {
    BNavbar,
    BNavbarBrand,
  },
  data() {
    const appName = ''

    const freightValidator = new FreightValidator()

    const destinations = []
    const destination = ''

    const weight = ''
    const idealWeightInKg = 100

    const transports = []
    const destinationTransports = []

    const fasterFreight = {}
    const cheapestFreight = {}

    return {
      appName,
      destinations,
      destination,
      weight,
      transports,
      destinationTransports,
      freightValidator,
      idealWeightInKg,
      fasterFreight,
      cheapestFreight
    }
  },
  async created() {
    // Implemente aqui o GET dos dados da API REST
    // para que isso ocorra na inicialização da pagina
    this.appName = 'Melhor Frete'

    const API_URL = 'http://localhost:3000/transport'
    this.transports = await Request.GET(API_URL)

    this.transports.forEach(transport => {
      if (!this.destinations.includes(transport.city))
        this.destinations.push(transport.city)

      this.destinations = [...(new Set(this.destinations))]
    })
  },
  methods: {
    // Implemente aqui os metodos utilizados na pagina
    allowOnlyNumbers() {
      this.weight = this.weight.replace(/\D/g, '').replace(/(\d{1,})/g, '$1')
    },
    setFreights() {
      let fasterFreight = this.destinationTransports[0]
      let cheapestFreight = this.destinationTransports[0]

      this.destinationTransports.forEach(transport => {
        if (transport.lead_time < fasterFreight.lead_time)
          fasterFreight = transport

        if (this.weight <= this.idealWeightInKg) {
          if (transport.cost_transport_light < cheapestFreight.cost_transport_light)
            cheapestFreight = transport
        } else {
          if (transport.cost_transport_heavy < cheapestFreight.cost_transport_heavy)
            cheapestFreight = transport
        }
      })

      this.fasterFreight = fasterFreight
      this.cheapestFreight = cheapestFreight
    },
    checkForm(event) {
      event.preventDefault()

      const validationError = this.freightValidator.validate(this.destination, this.weight)

      if (validationError) {
        return alert(validationError)
      }

      this.destinationTransports = this.transports.filter(
        transport => transport.city === this.destination
      )

      this.destinationTransports.forEach(transport => {
        transport.cost_transport_heavy = NumberFormatter.currencyToNumber(transport.cost_transport_heavy)
        transport.cost_transport_light = NumberFormatter.currencyToNumber(transport.cost_transport_light)
        transport.lead_time = NumberFormatter.hoursToNumber(transport.lead_time)
      })

      this.setFreights()

      console.log(this.destinationTransports)
      console.log("Mais rápido", this.fasterFreight)
      console.log("Mais econômico", this.cheapestFreight)
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
