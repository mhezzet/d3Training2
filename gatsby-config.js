module.exports = {
  siteMetadata: {
    title: `D3 training`,
    description: `learning d3`,
    author: `mhezzet`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-plugin-postcss`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fb8122`,
        display: `minimal-ui`,
        icon: `src/images/m.jpg`,
      },
    },
    `gatsby-plugin-offline`,
  ],
}
