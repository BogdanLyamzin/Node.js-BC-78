import createHttpError from "http-errors";

import Contact from "../db/models/Contact.js";

export const getContacts = async (req, res)=> {
  const {page = 1, perPage = 10, sortBy, sortOrder, type, search} = req.query;
  const skip = (page - 1) * perPage;
  const ContactsQuery = Contact.find();
  if(type) {
    ContactsQuery.where("type").equals(type);
  }

  if(search) {
    ContactsQuery.where({
      $text: {
        $search: search,
      }
    })
  }
  // if(search) {
  //   ContactsQuery.where({
  //     name: {
  //       $regex: search,
  //       $options: "i"
  //     }
  //   })
  // }
  // if(minAge) {
  //   ContactsQuery.where("age").gte(minAge);
  // }
  // if(maxAge) {
  //   ContactsQuery.where("age").lte(maxAge);
  // }
  const [contacts, total] = await Promise.all([
    ContactsQuery.clone().skip(skip).limit(perPage).sort({[sortBy]: sortOrder}),
    ContactsQuery.countDocuments()
  ]);

  const totalPages = Math.ceil(total / perPage);

  res.json({
    contacts,
    total,
    totalPages,
    page,
    perPage,
  });
};

export const getContactById = async (req, res)=> {
  const {id: _id} = req.params;
  const contact = await Contact.findOne({_id});
  if(!contact) throw createHttpError(404, `Contact with id=${_id} not found`);

  res.json(contact);
};

export const addContact = async(req, res)=> {
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
};

export const updateContactById = async(req, res)=> {
  const {id: _id} = req.params;
  const updateContact = await Contact.findOneAndUpdate({_id}, req.body);
  if(!updateContact) throw createHttpError(404, `Contact with id=${_id} not found`);
  res.json(updateContact);
};

export const deleteContactById = async(req, res)=> {
  const {id: _id} = req.params;
  const deleteContact = await Contact.findOneAndDelete({_id});
  if(!deleteContact) throw createHttpError(404, `Contact with id=${_id} not found`);
  // res.status(204).send()
  res.json({
    message: "Delete successfully"
  })
}
