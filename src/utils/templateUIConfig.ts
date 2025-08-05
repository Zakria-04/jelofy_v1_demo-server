export const startupTemplateUiConfig = {
  SimpleBites: {
    // {
    //   key: "background color",
    //   inputType: "color",
    //   groupKey: "General",
    //   labelKey: "ui.backgroundColor.label",
    //   path: "backgroundColor.color",
    //   defaultValue: "background color",
    // },
    // // {
    // //   key: "background image",
    // //   inputType: "file",
    // //   groupKey: "General",
    // //   labelKey: "ui.backgroundImage.label",
    // //   path: "backgroundImage.url",
    // //   defaultValue: "background image",
    // // },

    // // Header
    // {
    //   key: "background color",
    //   inputType: "color",
    //   groupKey: "Header",
    //   labelKey: "ui.header.logoText.label",
    //   path: "header.backgroundColor.color",
    //   defaultValue: "logo text",
    // },
    // {
    //   key: "Logo text",
    //   inputType: "text",
    //   groupKey: "Header",
    //   labelKey: "ui.header.logoText.label",
    //   path: "header.logoText.name",
    //   defaultValue: "logo text",
    // },
    // {
    //   key: "Logo picture",
    //   inputType: "file",
    //   groupKey: "Header",
    //   labelKey: "ui.header.logoText.label",
    //   path: "header.logoUrl.url",
    //   defaultValue: "logo text",
    // },
    // {
    //   key: "contact information",
    //   inputType: "text",
    //   groupKey: "Header",
    //   labelKey: "ui.header.contactInformation.label",
    //   path: "header.contactInformation.name",
    // },
    // {
    //   key: "contact phone",
    //   inputType: "text",
    //   groupKey: "Header",
    //   labelKey: "ui.header.contactInformation.label",
    //   path: "header.contactInformation.phone",
    // },
    // {
    //   key: "contact icon color",
    //   inputType: "color",
    //   groupKey: "Header",
    //   labelKey: "ui.header.contactInformation.label",
    //   path: "header.contactInformation.iconColor",
    // },
    // {
    //   key: "contact text color",
    //   inputType: "color",
    //   groupKey: "Header",
    //   labelKey: "ui.header.contactInformation.label",
    //   path: "header.contactInformation.color",
    // },

    // // category
    // {
    //   key: "selected category background color",
    //   inputType: "color",
    //   groupKey: "Category",
    //   labelKey: "ui.category.backgroundColor.label",
    //   path: "category.backgroundColorSelected.color",
    // },
    // {
    //   key: "unselected category background color",
    //   inputType: "color",
    //   groupKey: "Category",
    //   labelKey: "ui.category.backgroundColor.label",
    //   path: "category.backgroundColor.color",
    // },
    // {
    //   key: "selected border",
    //   inputType: "color",
    //   groupKey: "Category",
    //   labelKey: "ui.category.backgroundColor.label",
    //   path: "category.borderSelected.color",
    // },
    // {
    //   key: "unselected border",
    //   inputType: "color",
    //   groupKey: "Category",
    //   labelKey: "ui.category.backgroundColor.label",
    //   path: "category.borderSelected.color",
    // },
    // {
    //   key: "selected text color",
    //   inputType: "color",
    //   groupKey: "Category",
    //   labelKey: "ui.category.textColor.label",
    //   path: "category.textColorSelected.color",
    // },
    // {
    //   key: "text color",
    //   inputType: "color",
    //   groupKey: "Category",
    //   labelKey: "ui.category.textColor.label",
    //   path: "category.textColor.color",
    // },

    // // meals container box
    // {
    //   key: "background color",
    //   inputType: "color",
    //   groupKey: "Meal Box",
    //   labelKey: "ui.category.textColor.label",
    //   path: "mealsContainer.backgroundColor.color",
    // },
    // {
    //   key: "meal name",
    //   inputType: "color",
    //   groupKey: "Meal Box",
    //   labelKey: "ui.category.textColor.label",
    //   path: "mealsContainer.mealName.color",
    // },
    // // {
    // //   key: "meal image size",
    // //   inputType: "color",
    // //   groupKey: "Meal Box",
    // //   labelKey: "ui.category.textColor.label",
    // //   path: "mealsContainer.mealName.color",
    // // },
    // {
    //   key: "meal description",
    //   inputType: "color",
    //   groupKey: "Meal Box",
    //   labelKey: "ui.category.textColor.label",
    //   path: "mealsContainer.mealDescription.color",
    // },
    // {
    //   key: "meal price",
    //   inputType: "color",
    //   groupKey: "Meal Box",
    //   labelKey: "ui.category.mealPrice.label",
    //   path: "mealsContainer.mealPrice.color",
    // },
    // {
    //   key: "mealQuantity",
    //   inputType: "color",
    //   groupKey: "Meal Box",
    //   labelKey: "ui.category.mealQuantity.label",
    //   path: "mealsContainer.mealPrice.color",
    // },
    // {
    //   key: "meal border",
    //   inputType: "color",
    //   groupKey: "Meal Box",
    //   labelKey: "ui.category.mealBorder.label",
    //   path: "mealsContainer.mealBorder.color",
    // },
    General: [
      {
        inputType: "color",
        labelKey: "general.backgroundColor",
        path: "backgroundColor.color",
      },
    ],

    Header: [
      {
        inputType: "color",
        labelKey: "header.backgroundColor",
        path: "header.backgroundColor",
      },
      {
        inputType: "text",
        labelKey: "header.logoText",
        path: "header.logoText.name",
      },
      {
        inputType: "file",
        labelKey: "header.logoImage",
        path: "header.logoUrl.url",
      },
    ],

    Contact: [
      {
        inputType: "checkbox",
        labelKey: "contact.enableContact",
        description: "contact.enableContactDescription",
        path: "header.contactInformation.enabled",
      },
      {
        inputType: "text",
        labelKey: "contact.callMessage",
        path: "header.contactInformation.name",
      },
      {
        inputType: "text",
        labelKey: "contact.phone",
        path: "header.contactInformation.phone",
      },
      {
        inputType: "color",
        labelKey: "contact.iconColor",
        path: "header.contactInformation.color",
      },
    ],

    Category: [
      {
        inputType: "checkbox",
        labelKey: "category.enableCategory",
        description: "category.enableCategoryDescription",
        path: "category.enabled",
      },
      {
        inputType: "color",
        labelKey: "category.selectedCategoryBackgroundColor",
        path: "category.backgroundColorSelected.color",
      },
      {
        inputType: "color",
        labelKey: "category.categoryBackgroundColor",
        path: "category.backgroundColor.color",
      },
      {
        inputType: "color",
        labelKey: "category.selectedCategoryBorderColor",
        path: "category.borderSelected.color",
      },
      {
        inputType: "color",
        labelKey: "category.categoryBorderColor",
        path: "category.border.color",
      },
      {
        inputType: "color",
        labelKey: "category.selectedCategoryTextColor",
        path: "category.textColorSelected.color",
      },
      {
        inputType: "color",
        labelKey: "category.categoryTextColor",
        path: "category.textColor.color",
      },
    ],

    Meals_Container: [
      {
        inputType: "color",
        labelKey: "mealContainer.backgroundColor",
        path: "mealsContainer.backgroundColor.color",
      },
      {
        inputType: "color",
        labelKey: "mealContainer.mealName",
        path: "mealsContainer.mealName.color",
      },
      {
        inputType: "color",
        labelKey: "mealContainer.mealDescription",
        path: "mealsContainer.mealDescription.color",
      },
      {
        inputType: "color",
        labelKey: "mealContainer.mealSize",
        path: "mealsContainer.mealSize.color",
      },
      {
        inputType: "color",
        labelKey: "mealContainer.mealPrice",
        path: "mealsContainer.mealPrice.color",
      },
      {
        inputType: "color",
        labelKey: "mealContainer.mealContainerBorder",
        path: "mealsContainer.mealBorder.color",
      },
    ],
  },
  Velora: {},
};
