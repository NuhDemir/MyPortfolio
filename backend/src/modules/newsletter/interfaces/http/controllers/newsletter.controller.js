import asyncHandler from "express-async-handler";
import { SubscriberModel } from "../infrastructure/persistence/mongoose/SubscriberModel.js";
import axios from "axios";

export const createNewsletterController = () => {
  const subscribe = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Lütfen e-posta adresinizi girin.");
    }

    // 1. Veritabanına kaydet (Yedekleme ve kendi sistemimiz için)
    let subscriber = await SubscriberModel.findOne({ email });
    
    if (subscriber && subscriber.status === "subscribed") {
      return res.status(200).json({ message: "Zaten bültene abonesiniz. Teşekkürler!" });
    }

    if (!subscriber) {
      subscriber = await SubscriberModel.create({
        email,
        status: "pending", // Double opt-in beklemesinde
        ipAddress: req.ip,
      });
    }

    // 2. Brevo (Sendinblue) Entegrasyonu (Eğer .env de API Key varsa)
    const brevoApiKey = process.env.BREVO_API_KEY;
    const brevoListId = process.env.BREVO_LIST_ID; // Sayısal bir değer olmalı (örneğin: 2)
    const brevoTemplateId = process.env.BREVO_DOI_TEMPLATE_ID; // Double Opt-In için gerekli şablon ID'si (opsiyonel)

    if (brevoApiKey) {
      try {
        if (brevoTemplateId && brevoListId) {
          // Double Opt-in onay maili gönderme (Brevo'da özel şablon kurulmuşsa)
          await axios.post(
            "https://api.brevo.com/v3/contacts/doubleOptinConfirmation",
            {
              email: email,
              includeListIds: [Number(brevoListId)],
              templateId: Number(brevoTemplateId),
              redirectionUrl: "https://nuhdemir.netlify.app/", // Onay sonrası yönlendirilecek sayfa
            },
            {
              headers: {
                "api-key": brevoApiKey,
                "Content-Type": "application/json",
              },
            }
          );
        } else if (brevoListId) {
          // Normal listeye ekleme (Double opt-in ayarlanmamışsa)
          await axios.post(
            "https://api.brevo.com/v3/contacts",
            {
              email: email,
              listIds: [Number(brevoListId)],
              updateEnabled: true,
            },
            {
              headers: {
                "api-key": brevoApiKey,
                "Content-Type": "application/json",
              },
            }
          );
        }
      } catch (error) {
        console.error("Brevo entegrasyon hatası:", error?.response?.data || error.message);
        // Hata olsa bile kullanıcıya başarılı döndürüyoruz, DB'ye kaydettik çünkü
      }
    }

    res.status(201).json({
      message: "Abonelik talebiniz alındı! Lütfen e-postanızı kontrol ederek aboneliğinizi onaylayın.",
    });
  });

  return {
    subscribe,
  };
};

export default createNewsletterController;
