const express = require("express");
const Joi = require("joi");

const createFolderValidation = Joi.object({
  name: Joi.string().trim().min(1).max(5).required(),
});

module.exports = { createFolderValidation };
