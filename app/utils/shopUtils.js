export function buildShopPayload(formData) {
  return {
    name: formData.name,
    description: formData.description,
    contact: {
      email: formData.contact.email,
      phone: formData.contact.phone,
      address: {
        street: formData.contact.address.street,
        city: formData.contact.address.city,
        state: formData.contact.address.state,
        country: formData.contact.address.country,
        zipCode: formData.contact.address.zipCode,
      },
    },
    socialMedia: {
      website: formData.socialMedia.website,
      facebook: formData.socialMedia.facebook,
      instagram: formData.socialMedia.instagram,
    },
    settings: {
      commissionRate: formData.settings.commissionRate,
      autoApproveProducts: formData.settings.autoApproveProducts,
    },
    logo: formData.logo,
    banner: formData.banner,
    slug: formData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-'),
  };
}
