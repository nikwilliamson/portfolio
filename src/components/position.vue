<template>
  <div class="job">
    <p class="date" v-if="endDate">{{ moment(startDate).format("MMMM YYYY") }} - {{ moment(endDate).format("MMMM YYYY") }}</p>
    <p class="date" v-else>{{ moment(startDate).format("MMMM YYYY") }}</p>
    <div class="details">
      <h4 class="company">{{ company }}</h4>
      <h2 class="title">{{ title }}</h2>
      <p class="description">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: "JobPosition",
  props: {
    company: String,
    title: String,
    startDate: String,
    endDate: String,
    description: String
  },
  created: function () {
    this.moment = moment;
  },
};
</script>

<style scoped>
p {
  white-space: pre-line;  
}
.job {
  display: grid; 
  grid-template-columns: 1fr 3fr; 
  grid-template-rows: 1fr; 
  grid-column-gap: 2rem;
  grid-row-gap: 0;
  color: #232830;
}

h4, .date {
  font-size: 16px;
  margin: 0;
  padding: 0;
  line-height: 1.5rem;
  }

h2 {
  font-size: 1.777rem;
  font-weight: 400;
  margin: 0;
  line-height: 1.5em;
}
.company {
  background-image: linear-gradient(270deg, #C850C0, #4158D0);
  background-clip: text;
  color: transparent;
  display: inline-block;
}
.description {
  font-size: 1.33rem;
  line-height: 1.5em;
  max-width: 80ch;
}

@media only screen and (max-width: 600px) {
  .job {
    grid-template-columns: 1fr; 
    grid-template-rows: auto 1fr; 
  }
}
</style>
