import { Request, Response } from "express";
import LANGUAGE_MODEL from "../Models/language.model"; // adjust the path
import serverError from "../../utils/errorMessage";
import _ from "lodash";

const upsertLanguage = async (req: Request, res: Response) => {
  try {
    const { lang, translations } = req.body;

    if (!lang || !translations) {
      res.status(400).json({ message: "lang and translations are required." });
      return;
    }

    const existingLang = await LANGUAGE_MODEL.findOne({ lang });

    let mergedTranslations = translations;

    if (existingLang) {
      // Deep merge existing and new translations
      mergedTranslations = _.merge({}, existingLang.translations, translations);
    }

    const updatedLang = await LANGUAGE_MODEL.findOneAndUpdate(
      { lang },
      { $set: { translations: mergedTranslations } },
      { upsert: true, new: true }
    );

    res.status(200).json(updatedLang);
  } catch (error) {
    serverError(error, res);
  }
};

const getLanguage = async (req: Request, res: Response) => {
  try {
    const { lang } = req.params;

    const languageDoc = await LANGUAGE_MODEL.findOne({ lang });

    if (!languageDoc) {
      res.status(404).json({ message: "Language not found." });
      return;
    }

    res.status(200).json(languageDoc);
  } catch (error) {
    serverError(error, res);
  }
};

export { upsertLanguage, getLanguage };
