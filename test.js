let t = {
  "is_verified": true,
  "tracks": [
    "647703400dab7e1537aa9753",
    "647712860dab7e1537aa97c6",
    "647712bb0dab7e1537aa97d0",
    "6477130f0dab7e1537aa97dd"
  ],
  "account_type": "artist",
  "orders": [
    "64771d54e89a6474758914f5",
    "64771d7de89a647475891502",
    "64774d7ce89a6474758915c0",
    "64774ee6e89a6474758915c4",
    "64775049aff92148c5c88814",
    "647750a1aff92148c5c88818",
    "64781813de64c87624771c88",
    "647819c614bbba0132f0dd37"
  ],
  "date_created": {
    "$date": "2023-05-31T08:12:38.031Z"
  },
  "date_modified": {
    "$date": "2023-05-31T08:15:10.631Z"
  },
  "username": "Davenport",
  "address": "Doornfontein",
  "password": "$2b$10$2/x8cL7SuI4eEnjbExO.Q.7I0g4JmfPz/eefSudDWjdlmg7OTfPPC",
  "email": "squashdavenport2@gmail.com"
}
for (let f in t){
  console.log(f, ":", typeof t[f]);
}
