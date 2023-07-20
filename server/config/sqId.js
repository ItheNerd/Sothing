// Function to generate a unique sq_id
const generateSqId = (slug, company, brand, name) => {
  // Generate the sq_id by combining slug, company, and brand
  const formattedSlug = slug.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const formattedName = name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const formattedCompany = company.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const formattedBrand = brand.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  const sq_id = `${formattedSlug}-${formattedName}-${formattedCompany}-${formattedBrand}`;

  return sq_id;
};

module.exports = generateSqId;
