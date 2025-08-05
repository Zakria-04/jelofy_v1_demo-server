export const templateDefaults = {
  SimpleBites: {
    backgroundColor: { color: "#1C1C1C", enabled: true },
    backgroundImage: { url: "", enabled: false },
    header: {
      backgroundColor: "transparent",
      logoText: {
        name: "Burger Palace",
        color: "#FDFAF6",
        enabled: true,
      },
      logoUrl: {
        url: "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1747643762/burger_3_r7b54a.png",
        enabled: true,
      },
      contactInformation: {
        name: "call-us",
        phone: "+1 234 567 890",
        color: "#9D3737",
        iconColor: "#9D3737",
        enabled: true,
      },
    },

    category: {
      backgroundColorSelected: { color: "#9D3737" },
      backgroundColor: { color: "transparent" },
      borderSelected: { size: "1px", color: "#FDFAF6" },
      border: { size: "1px", color: "#9D3737" },
      textColorSelected: { color: "#FDFAF6" },
      textColor: { color: "#E55656" },
      enabled: true,
    },
    mealsContainer: {
      backgroundColor: { color: "#1E1E1E" },
      mealName: { color: "#FDFAF6", enabled: true },
      mealImageSize: { size: "150px", radius: "0px", enabled: true },
      mealDescription: { color: "#FDFAF6", enabled: true },
      mealPrice: { color: "#9D3737", enabled: true },
      // mealQuantity: { color: "#F9F9F9", disable: false },
      mealBorder: { size: "1px", color: "#3B2424", enabled: true },
      mealSize: {
        color: "#9D3737",
        border: "1px solid #9D3737",
      },
    },

    languageModal: {
      backgroundColor: { color: "#1C1C1C" },
      textColor: { color: "#FDFAF6" },
      enabled: true,
    },
  },

  Velora: {
    header: {
      logoUrl: {
        url: "https://res.cloudinary.com/dvvm7u4dh/image/upload/v1747643762/burger_3_r7b54a.png",
        enabled: true,
      },
    },
  },
  
  Goldenella: {
    header: {
      backgroundImage: {
        url: "https://res.cloudinary.com/dfwjujk7m/image/upload/v1753293394/76ecce12-afa9-4cb2-b993-442a8603288e_g7jwwf.png",
        enabled: true,
      }
    }
  }
};
