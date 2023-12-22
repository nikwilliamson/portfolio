import JobPosition from '../components/position.vue';

export default {
  title: 'Job Posting',
  component: JobPosition,
  argTypes: {
    startDate: { type: 'date' },
    endDate: { type: 'date' },
    company: { type: 'string'},
    title: { type: 'string'},
    description: { type: 'string'}
  },
};

const Template = (args) => ({
  components: { JobPosition },
  setup() {
    return { args };
  },
  template: '<JobPosition v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  startDate: "09/01/2018",
  endDate: "02/01/2021",
  company: "Electronic Arts",
  title: "UX Designer II",
  description: "Currently on the Design System team building out the design system and documentation to be used when building EA products. As an user experience designer, I focus on creating world-class experiences for around-game experiences. I work closely on our latest iterations of products and services that span across EAs products.\n\nBeing an integral part of the design system team, I am responsible for creating, maintaining, and supporting all aspects of the design system.\n\nDesigned the User Profile for the new EA Desktop application.\nContributed significantly to the Healthy Play portion of the EA Desktop application, allowing parents and players to monitor their gameplay habits.\n\nLed workshop where we focused on improving the onboarding experience for new designers using the design system, and establishing a system to consolidate similar experiences into a singular design system component.\n\nDesigned internal admin tools to make product maintenance and creation significantly more efficient."
};
