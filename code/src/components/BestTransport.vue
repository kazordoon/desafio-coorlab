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

    <div id="freight-info">
      <h4 v-if="destinationTransports.length == 0">Nenhum dado selecionado</h4>
      <div v-else>
        <h4>Estas são as melhores alternativas de frete que encontramos para você</h4>
        <div>
          <p><b>Frete com menor valor</b></p>
          <p>Transportadora: {{ cheapestFreight.name }}</p>
          <p>Tempo estimado: {{ cheapestFreight.lead_time }}h</p>
          <p>Preço: {{ cheapestFreight.price }}</p>
        </div>
        <div>
          <p><b>Frete mais rápido</b></p>
          <p>Transportadora: {{ fasterFreight.name }}</p>
          <p>Tempo estimado: {{ fasterFreight.lead_time }}h</p>
          <p>Preço: {{ fasterFreight.price }}</p>
        </div>
      </div>
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
    formatTransport(transport) {
      return {
        ...transport,
        lead_time: NumberFormatter.hoursToNumber(transport.lead_time),
        cost_transport_heavy: NumberFormatter.currencyToNumber(transport.cost_transport_heavy),
        cost_transport_light: NumberFormatter.currencyToNumber(transport.cost_transport_light)
      }
    },
    setFreights() {
      const [firstTransport] = this.destinationTransports;

      const formattedTransport = this.formatTransport(firstTransport)
      let fasterFreight = formattedTransport
      let cheapestFreight = formattedTransport

      this.destinationTransports.forEach(transport => {
        const currentTransport = this.formatTransport(transport)

        if (currentTransport.lead_time < fasterFreight.lead_time)
          fasterFreight = currentTransport

        if (this.weight <= this.idealWeightInKg) {
          if (currentTransport.cost_transport_light < cheapestFreight.cost_transport_light)
            cheapestFreight = currentTransport

            fasterFreight.price = NumberFormatter.numberToCurrency(this.weight * fasterFreight.cost_transport_light)
            cheapestFreight.price = NumberFormatter.numberToCurrency(this.weight * cheapestFreight.cost_transport_light)
        } else {
          if (currentTransport.cost_transport_heavy < cheapestFreight.cost_transport_heavy)
            cheapestFreight = currentTransport

            fasterFreight.price = NumberFormatter.numberToCurrency(this.weight * fasterFreight.cost_transport_heavy)
            cheapestFreight.price = NumberFormatter.numberToCurrency(this.weight * cheapestFreight.cost_transport_heavy)
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

      this.setFreights()
    }
  },
}
</script>
<!-- Como pode notar, sou péssimo em CSS, mas tentei ¯\_(ツ)_/¯ -->
<style scoped>
.title {
  width: 90vw;
  margin: 10vh auto;
  box-shadow: .5px .5px 6px black;
}
.title .navbar {
  background-color: #00aca6 !important;
  border-radius: 10px;
}

.title .navbar-brand {
  margin-left: 20px;
}

#freight-form {
  padding: 5%;
  background-color: #c9c9c9;
}
</style>
