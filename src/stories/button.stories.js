import NWButton from '../components/button.vue';

export default {
  title: 'Button',
  component: NWButton,
  argTypes: {
    label: { type: 'string' },
    buttonType: {
      options: ['link', 'button'],
      control: { type: 'radio' },
    },
  },
};

const Template = (args) => ({
  components: { NWButton },
  setup() {
    return { args };
  },
  template: '<NWButton v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  label: "Label",
  buttonType: "link",
};