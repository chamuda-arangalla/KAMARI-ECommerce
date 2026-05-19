import HomeContent from "../models/HomeContent.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const DEFAULT_HOME_CONTENT = {
  heroImage: {
    url: "https://images.unsplash.com/photo-1602810317536-5d5e8a552d95?auto=format&fit=crop&w=1800&q=90",
    publicId: "",
  },
  collectionImage: {
    url: "https://images.unsplash.com/photo-1602810317536-5d5e8a552d95?auto=format&fit=crop&w=800&q=80",
    publicId: "",
  },
  brandStoryImage: {
    url: "https://images.unsplash.com/photo-1600421684555-707fae8df4fd?auto=format&fit=crop&w=1000&q=85",
    publicId: "",
  },
  categories: [
    {
      id: 1,
      name: "FLOW SET",
      image: {
        url: "https://images.unsplash.com/photo-1602810317536-5d5e8a552d95?auto=format&fit=crop&w=800&q=80",
        publicId: "",
      },
    },
    {
      id: 2,
      name: "EASE SET",
      image: {
        url: "https://images.unsplash.com/photo-1600421684555-707fae8df4fd?auto=format&fit=crop&w=800&q=80",
        publicId: "",
      },
    },
    {
      id: 3,
      name: "BOLD SET",
      image: {
        url: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80",
        publicId: "",
      },
    },
    {
      id: 4,
      name: "BREEZE SET",
      image: {
        url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
        publicId: "",
      },
    },
  ],
  moodImages: [
    {
      url: "https://images.unsplash.com/photo-1616627988047-1f1a28aa25a9?auto=format&fit=crop&w=500&q=80",
      publicId: "",
    },
    {
      url: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=500&q=80",
      publicId: "",
    },
    {
      url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=80",
      publicId: "",
    },
    {
      url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80",
      publicId: "",
    },
    {
      url: "https://images.unsplash.com/photo-1600421684555-707fae8df4fd?auto=format&fit=crop&w=500&q=80",
      publicId: "",
    },
  ],
};

const getUploadedFile = (req, fieldName) => {
  if (Array.isArray(req.files)) return req.files.find((file) => file.fieldname === fieldName);
  return req.files?.[fieldName]?.[0];
};

const uploadHomeImage = (file) => uploadToCloudinary(file, "kamari/home");

const parseJsonField = (field, fallback) => {
  if (!field) return fallback;
  return typeof field === "string" ? JSON.parse(field) : field;
};

const getOrCreateHomeContent = async () => {
  let content = await HomeContent.findOne({ key: "home" });

  if (!content) {
    content = await HomeContent.create({
      key: "home",
      ...DEFAULT_HOME_CONTENT,
    });
  }

  return content;
};

export const getHomeContent = async (req, res) => {
  try {
    const content = await getOrCreateHomeContent();

    return res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch home content",
      error: error.message,
    });
  }
};

export const updateHomeContent = async (req, res) => {
  try {
    const content = await getOrCreateHomeContent();

    const categoryPayload = parseJsonField(req.body.categories, content.categories);
    const moodPayload = parseJsonField(req.body.moodImages, content.moodImages);

    if (req.body.heroImageUrl !== undefined) {
      content.heroImage = { url: req.body.heroImageUrl, publicId: "" };
    }
    if (req.body.collectionImageUrl !== undefined) {
      content.collectionImage = { url: req.body.collectionImageUrl, publicId: "" };
    }
    if (req.body.brandStoryImageUrl !== undefined) {
      content.brandStoryImage = { url: req.body.brandStoryImageUrl, publicId: "" };
    }

    const heroFile = getUploadedFile(req, "heroImage");
    const collectionFile = getUploadedFile(req, "collectionImage");
    const brandStoryFile = getUploadedFile(req, "brandStoryImage");

    if (heroFile) content.heroImage = await uploadHomeImage(heroFile);
    if (collectionFile) content.collectionImage = await uploadHomeImage(collectionFile);
    if (brandStoryFile) content.brandStoryImage = await uploadHomeImage(brandStoryFile);

    content.categories = await Promise.all(
      categoryPayload.map(async (category, index) => {
        const uploaded = getUploadedFile(req, `categoryImage${index}`);

        return {
          id: Number(category.id || index + 1),
          name: category.name,
          image: uploaded
            ? await uploadHomeImage(uploaded)
            : category.image || content.categories[index]?.image,
        };
      })
    );

    content.moodImages = await Promise.all(
      moodPayload.map(async (image, index) => {
        const uploaded = getUploadedFile(req, `moodImage${index}`);
        return uploaded ? await uploadHomeImage(uploaded) : image;
      })
    );

    await content.save();

    return res.status(200).json({
      success: true,
      message: "Home content updated successfully",
      data: content,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update home content",
      error: error.message,
    });
  }
};
