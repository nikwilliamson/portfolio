import NWGlowButton from '../components/glowButton.vue';

export default {
  title: 'Glow Button',
  component: NWGlowButton,
  argTypes: {
    label: { type: 'string' },
    buttonType: {
      options: ['link', 'button'],
      control: { type: 'radio' },
    },
  },
};

const Template = (args) => ({
  components: { NWGlowButton },
  setup() {
    return { args };
  },
  template: '<NWGlowButton v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  label: "Label",
  buttonType: "link",
};