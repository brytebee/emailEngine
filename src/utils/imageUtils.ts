// // utils/imageUtils.ts

// /**
//  * Generates initials from a string (typically product name)
//  * @param text The text to generate initials from
//  * @returns String containing the initials
//  */
// export const getInitials = (text: string = ""): string => {
//   if (!text) return "";

//   // Split by spaces and get first letter of each word
//   return text
//     .split(" ")
//     .map((word) => word[0]?.toUpperCase() || "")
//     .join("")
//     .slice(0, 2); // Limit to 2 characters
// };

// /**
//  * Creates an SVG data URL with initials in a circle
//  * @param initials The initials to display
//  * @param backgroundColor Background color of the circle
//  * @param textColor Color of the text
//  * @returns SVG data URL
//  */
// export const createInitialsImage = (
//   initials: string,
//   backgroundColor: string = "#0a85ea",
//   textColor: string = "#ffffff"
// ): string => {
//   const svg = `
//     <svg xmlns="http://www.w3.org/2000/svg" width="200" height="48" viewBox="0 0 200 48">
//       <rect width="48" height="48" rx="24" fill="${backgroundColor}" />
//       <text
//         x="24"
//         y="24"
//         font-family="Arial, sans-serif"
//         font-size="18"
//         font-weight="bold"
//         fill="${textColor}"
//         text-anchor="middle"
//         dominant-baseline="middle"
//       >
//         ${initials}
//       </text>
//     </svg>
//   `;

//   // Convert SVG to a data URL
//   return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
// };

// /**
//  * Gets image URL for email template, falling back to initials-based SVG if no image provided
//  * @param imageUrl Custom image URL
//  * @param product Product name for generating initials
//  * @returns Image URL to use in email template
//  */
// export const getEmailLogoUrl = (
//   imageUrl: string | undefined,
//   product: string | undefined
// ): string => {
//   if (imageUrl) return imageUrl;

//   // Default cloudinary image if no product name is provided
//   if (!product) {
//     return "https://res.cloudinary.com/bizkollekt/image/upload/v1699220505/Business%20Images/abkj1m6ywpoojfxktg1h.png";
//   }

//   const initials = getInitials(product);
//   return createInitialsImage(initials);
// };

// utils/imageUtils.ts

/**
 * Generates initials from a string (typically product name)
 * @param text The text to generate initials from
 * @returns String containing the initials
 */
export const getInitials = (text: string = ""): string => {
  if (!text) return "";

  // Split by spaces
  const words = text.split(" ");

  // Take only the first 2 words (or fewer if there aren't 2)
  const limitedWords = words.slice(0, 2);

  // Get first letter of each word and join
  return limitedWords.map((word) => word[0]?.toUpperCase() || "").join("");
};

/**
 * Creates an SVG data URL with initials in a circle
 * @param initials The initials to display
 * @param backgroundColor Background color of the circle
 * @param textColor Color of the text
 * @returns SVG data URL
 */
export const createInitialsImage = (
  initials: string,
  backgroundColor: string = "#0a85ea",
  textColor: string = "#ffffff"
): string => {
  // Create a square SVG with a circular background and centered text
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="60" fill="${backgroundColor}" />
      <text 
        x="60" 
        y="60" 
        font-family="Arial, sans-serif" 
        font-size="48" 
        font-weight="bold" 
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="central"
      >
        ${initials}
      </text>
    </svg>
  `;

  // Convert SVG to a data URL
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

/**
 * Gets image URL for email template, falling back to initials-based SVG if no image provided
 * @param imageUrl Custom image URL
 * @param product Product name for generating initials
 * @returns Image URL to use in email template
 */
export const getEmailLogoUrl = (
  imageUrl: string | undefined,
  product: string | undefined
): string => {
  if (imageUrl) return imageUrl;

  // Default to a fallback image if no product name is provided
  if (!product || product.trim() === "") {
    return createInitialsImage("CO"); // Default to "CO" for "Company"
  }

  const initials = getInitials(product);
  return createInitialsImage(initials);
};
