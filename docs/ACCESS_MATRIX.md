# Access Control Matrix

| Role | Read | Create | Update | Delete | Publish | Refund | User Mgmt | Settings | Audit |
|---|---|---|---|---|---|---|---|---|---|
| Guest | Public | Cart/order where policy allows | — | — | — | — | — | — | — |
| User | Own data | Own commerce/support | Own data | Own account request | — | Own eligible request | — | — | — |
| Support | Support/order read | Tickets/notes | Support workflows | Limited | — | — | Limited support lookup | — | Read relevant audit |
| Content Manager | Content/product read | Content | Content | Content | Content | — | — | Content settings | Read content audit |
| Seller | Own catalog/order read | Products | Own products | Own products | — | — | — | — | Own-scope audit |
| Admin | Broad operational read | Operational entities | Operational entities | Restricted | Content | Refund | Limited | Operational | Read audit |
| Super Admin | Full | Full | Full | High-risk | Full | Refund | Full | Full | Full |
