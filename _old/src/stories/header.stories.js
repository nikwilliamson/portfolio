import PageHeader from '../components/header.vue';

export default {
  title: 'PageHeader',
  component: PageHeader,
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
  components: { PageHeader },
  setup() {
    return { args };
  },
  template: '<PageHeader v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  title: "pageTitle",
  buttonLabel: "Button label",
  buttonType: "link",
};