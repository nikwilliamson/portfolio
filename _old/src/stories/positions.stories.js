import JobPositions from '../components/positions.vue';

export default {
  title: 'Job Postings',
  component: JobPositions,
  argTypes: {
    positions: { type: 'object' }
  },
};

const Template = (args) => ({
  components: { JobPositions },
  setup() {
    return { args };
  },
  template: '<JobPositions v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  positions: [
            {
              "sys": {
                "id": "3oscNofkVSChBzuOlP3FN2"
              },
              "company": "Publix",
              "title": "Senior UX Designer",
              "startDate": "2021-02-01T00:00:00.000Z",
              "endDate": null,
              "description2": "Publix job description."
            },
            {
              "sys": {
                "id": "6EUWHH3CzPbqlhHX7E4qpM"
              },
              "company": "Electronic Arts",
              "title": "UX Designer II",
              "startDate": "2018-09-01T00:00:00.000Z",
              "endDate": "2021-02-01T00:00:00.000Z",
              "description2": "Currently on the Design System team building out the design system and documentation to be used when building EA products. As an user experience designer, I focus on creating world-class experiences for around-game experiences. I work closely on our latest iterations of products and services that span across EAs products.\n\nBeing an integral part of the design system team, I am responsible for creating, maintaining, and supporting all aspects of the design system.\n\nDesigned the User Profile for the new EA Desktop application.\nContributed significantly to the Healthy Play portion of the EA Desktop application, allowing parents and players to monitor their gameplay habits.\n\nLed workshop where we focused on improving the onboarding experience for new designers using the design system, and establishing a system to consolidate similar experiences into a singular design system component.\n\nDesigned internal admin tools to make product maintenance and creation significantly more efficient."
            },
            {
              "sys": {
                "id": "3gINe1o6YJcHVGA407tNWV"
              },
              "company": "Web Benefits Design",
              "title": "Senior UX Developer",
              "startDate": "2017-01-01T00:00:00.000Z",
              "endDate": "2018-03-01T00:00:00.000Z",
              "description2": "Led design effort for greenfield redesign of all current products including end user applications, client facing management tools, and internal admin applications; all within an agile development team.\n\nManaged website redesign effort with a contracted external designer to quickly redesign corporate website.\n\nEstablished a componentized design system to allow for rapid design and development iterations of new and existing features. This provided a consistent user experience across the suite of applications and reduced time to create supporting project documentation."
            },
            {
              "sys": {
                "id": "UIlwQvlFWaXvFjpCSonnm"
              },
              "company": "Florida Hospital",
              "title": "Senior UX Designer",
              "startDate": "2015-08-01T00:00:00.000Z",
              "endDate": "2016-09-01T00:00:00.000Z",
              "description2": "Oversaw design of the new patient portal native mobile applications and responsive web application for patients to manage and understand their relationship with Florida Hospital.\nLaunched embedded patient scheduling application giving providers a tool to engage patients online.\n\nWorked with TV manufacturer, Agile in-house development team, and contracted Agile development team to launch a Smart TV application to improve patient experience as well as improve patient quality of care.\n\nRegularly brought into the Florida Hospital Innovation lab to help facilitate design thinking exercises with other departments of the hospital network."
            },
            {
              "sys": {
                "id": "5uWnyukS7KyCrLDa07NIcv"
              },
              "company": "Sailthru",
              "title": "Head of UX & Design",
              "startDate": "2015-03-01T00:00:00.000Z",
              "endDate": "2015-08-01T00:00:00.000Z",
              "description2": "Established pattern library to quickly update an outdated design aesthetic without disrupting customer experience.\n\nLaunched visual email building tool to allow clients to create personalized emails while previewing and editing content dynamically pulled in from external sources.\n\nLaunched tool to create multivariate omni-channel campaigns where the client would have a consistent personalization experience across clients mobile apps, websites, email advertisements, and in-store experience."
            }
          ]
};
