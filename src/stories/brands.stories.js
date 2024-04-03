import Brands from '../components/header.vue';

export default {
  title: 'Brands',
  component: Brands,
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
  components: { Brands },
  setup() {
    return { args };
  },
  template: '<Brands v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  title: "pageTitle",
  buttonLabel: "Button label",
  buttonType: "link",
};