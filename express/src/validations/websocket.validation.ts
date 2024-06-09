import Joi from "joi";

interface seeMessagesInterface {
  of: string;
}

interface newMessageInterface {
  is_text: boolean;
  content: string;
  to: string;
}

const validateSeeMessages = (data: seeMessagesInterface) => {
  const schema = Joi.object({
    of: Joi.string().required(),
  });

  return schema.validate(data);
};

const validateNewMessage = (data: newMessageInterface) => {
  const schema = Joi.object({
    is_text: Joi.boolean().required(),
    content: Joi.required().when("is_text", {
      is: true,
      then: Joi.string().min(1).max(100),
      otherwise: Joi.string().min(10).max(100),
    }),
    to: Joi.string().required(),
  });

  return schema.validate(data);
};

export {
  validateNewMessage,
  validateSeeMessages,
  seeMessagesInterface,
  newMessageInterface,
};
