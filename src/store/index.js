import Vue from "vue";
import Vuex from "vuex";
import currencyServices from "@/services";
import { getDateBeforeDays } from "@/utils";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currencyCode: {
      to: "BRL",
      from: "USD",
    },

    currencyCode2: {
      to: "BRL",
      from: "USD",
    },    
    startDate: getDateBeforeDays(7),
    currenciesOptions: [],
    chartData: null,
    chartData2: null,
    onLoading: false,
  },

  mutations: {
    setCurrencyCode(state, { newValue, key }) {
      if (key === "to" || key === "from") {
        state.currencyCode[key] = newValue;
      }
    },
    setCurrencyCode2(state, { newValue, key }) {
      if (key === "to" || key === "from") {
        state.currencyCode2[key] = newValue;
      }
    },    
    setStartDate(state, newValue) {
      state.startDate = newValue;
    },
    setCurrenciesOptions(state, newValue) {
      state.currenciesOptions = newValue;
    },
    setChartData(state, newValue) {
      state.chartData = newValue;
    },
    setChartData2(state, newValue) {
      state.chartData2 = newValue;
    },    
    setLoading(state, newValue) {
      if (newValue) state.onLoading = newValue;
      else setTimeout(() => (state.onLoading = newValue), 500); //minimum waiting time
    },
  },

  actions: {
    async getCurrenciesOptions({ commit }) {
      const currencies = await currencyServices.getAllCurrencies();
      const currenciesNormalized = Object.values(currencies);

      commit("setCurrenciesOptions", currenciesNormalized);
    },
    async getCurrencyRates({ commit }, { from, to, to2, startDate }) {
      commit("setLoading", true);

      console.log(from, to, to2, startDate);
      const today = getDateBeforeDays();
      const rates = await currencyServices.getRatesHistory({
        from,
        to,
        startDate,
        endDate: today,
      });
   
      const rates2 = await currencyServices.getRatesHistory({
        from,
        to: to2,
        startDate,
        endDate: today,
      });

      const dates = [];
      const dates2 = [];
      const RatesCurrency = [];
      const RatesCurrency2 = [];

      for (const date of Object.keys(rates)) {
        dates.push(date.replace(/-/g, "/"));
        RatesCurrency.push(rates[date][to]);
      }

      for (const date of Object.keys(rates2)) {
        dates2.push(date.replace(/-/g, "/"));
        RatesCurrency2.push(rates2[date][to2]);
      }      


      commit("setChartData", {
        title: `${from} to ${to} Chart`,
        labels: dates,
        datasets: [
          {
            label: `${from} to ${to}`,
            data: RatesCurrency,
            backgroundColor: "rgba(0, 0, 0, 0.0)",
            borderColor: "#42b983",
            lineTension: 0,
            pointBorderColor: "#2c3e50",
            pointBackgroundColor: "#2c3e50",
          },
        ],
      });


      commit("setChartData2", {
        title: `${from} to ${to2} Chart`,
        labels: dates2,
        datasets: [
          {
            label: `${from} to ${to2}`,
            data: RatesCurrency2,
            backgroundColor: "rgba(0, 0, 0, 0.0)",
            borderColor: "#42b983",
            lineTension: 0,
            pointBorderColor: "#2c3e50",
            pointBackgroundColor: "#2c3e50",
          },
        ],
      });


      commit("setLoading", false);
    },
  },
});
