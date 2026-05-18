import { defineField, defineType } from "sanity";

export default defineType({
  name: "property",
  title: "Property",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required()
    }),
    defineField({ name: "architect", title: "Architect", type: "string" }),
    defineField({ name: "year", title: "Year", type: "number" }),
    defineField({
      name: "location",
      title: "Location",
      type: "object",
      fields: [
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "region", title: "Region", type: "string" }),
        defineField({ name: "country", title: "Country", type: "string" })
      ]
    }),
    defineField({ name: "coverImage", title: "Cover image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }]
    }),
    defineField({ name: "style", title: "Style", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "area", title: "Area (sqm)", type: "number" }),
    defineField({ name: "isPremium", title: "Premium", type: "boolean", initialValue: false }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime"
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }]
    }),
    defineField({
      name: "materials",
      title: "Materials",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } })
          ]
        }
      ]
    })
  ]
});
