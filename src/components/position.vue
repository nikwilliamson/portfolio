<template>
  <div class="job">
    <p class="date" v-if="endDate">{{ moment(startDate).format("MMMM YYYY") }} - {{ moment(endDate).format("MMMM YYYY") }}</p>
    <p class="date" v-else>{{ moment(startDate).format("MMMM YYYY") }}</p>
    <div class="details">
      <h4 class="company">{{ company }}</h4>
      <h2 class="title">{{ title }}</h2>
      <RichTextRenderer :document="description" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import RichTextRenderer from 'contentful-rich-text-vue-renderer';

export default {
  name: "JobPosition",
  components: { 
    RichTextRenderer 
  },
  props: {
    company: String,
    title: String,
    startDate: String,
    endDate: String,
    description2: String,
    description: Object
  },

  data() {
    return {
      document
    };
  },
  
  created: function () {
    this.moment = moment;
  },
};

</script>

<style>
p {
  font-size: 1.33rem;
  line-height: 1.5em;
  max-width: 80ch;
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

h2 {
  font-size: 1.777rem;
  font-weight: 500;
  margin: 0;
  line-height: 1.5em;
}


h3 {
  font-size: 1.333rem;
  font-weight: 600;
  margin: 2.369rem 0 0 0;
  line-height: 1.5em;
}

h4, .date {
  font-size: 1rem;
  margin: 0;
  padding: 0;
  font-weight: 600;
  line-height: 1.5rem;
  }

ul {
  margin: 0;
  padding: 0;
}

li {
  margin: .563rem 1.33rem;
  padding: 0;
  font-size: 1.33rem;
  line-height: 1.5em;
}

li p {
  margin: 0;
  padding: 0;
  font-size: 1.33rem;
  line-height: 1.5em;
}
.company {
  background-image: linear-gradient(270deg, #C850C0, #4158D0);
  background-clip: text;
  color: transparent;
  display: inline-block;
}


@media only screen and (max-width: 1000px) {
  .job {
    grid-template-columns: 1fr; 
    grid-template-rows: auto 1fr; 
  }
  p {
    font-size: 1rem;
  }
  li {
    margin: .563rem 1rem;
    padding: 0;
    font-size: 1rem;
    line-height: 1.5em;
  }

  li p {
    margin: 0;
    padding: 0;
    font-size: 1rem;
    line-height: 1.5em;
  }
  h2 {
    font-size: 1.333rem;
  }


  h3 {
    font-size: 1rem;
  }

  h4, .date {
    font-size: 1rem;
    }
}
</style>
