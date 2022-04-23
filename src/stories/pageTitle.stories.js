import PageTitle from '../components/pageTitle.vue';

export default {
  title: 'PageTitle',
  component: PageTitle,
  argTypes: {
    title: { type: 'string' },
    buttonLabel: { type: 'string' },
    buttonType: {
      options: ['link', 'button'],
      control: { type: 'radio' },
    },
  },
};

const Template = (args) => ({
  components: { PageTitle },
  setup() {
    return { args };
  },
  template: '<PageTitle v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  title: "pageTitle",
  buttonLabel: "Button label",
  buttonType: "link",
};