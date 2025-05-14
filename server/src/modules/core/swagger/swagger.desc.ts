export const SWAGGER_DESC = `
  ## 🔧 Technical Documentation v1.0

  ### 📦 Core Features
  • **JWT Auth Flow**  
    - Access/Refresh tokens  
    - Session management  
    - User-agent/IP tracking  

  • **Products Engine**  
    - Multi-image uploads  
    - Size variants system  
    - Paginated search (offset/limit)  

  • **Commerce Logic**  
    - Cart microservice  
    - Favorites subsystem  
    - Order processing  

  ### ⚙️ Technical Specs
  \`\`\`yaml
  API_ROOT: /api
  AUTH: 
    Type: JWT 
    Header: Authorization: Bearer {token}
    Cookie: refreshToken (HttpOnly)
  PAYLOADS: 
    Default: JSON 
    Multipart: Product images
  RESPONSES: 
    Success: 200 | 201 
    Errors: Standard HTTP codes
  \`\`\`

  ### 🛠️ Key Endpoints
  | Method | Path                  | Auth | Description              |
  |--------|-----------------------|------|--------------------------|
  | POST   | /auth/login           | ❌   | Get JWT pair             |
  | POST   | /products/search      | ❌   | Filtered product search  |
  | POST   | /cart/add             | ✅   | Add item to cart         |
  | PATCH  | /products/update/{id} | ✅   | Edit product (admin)     |

  ### 🚨 Error Samples
  \`\`\`json
  // 401 Unauthorized
  {
    "statusCode": 401,
    "message": "Invalid refresh token"
  }
  
  // 400 Validation Error
  {
    "error": "Bad Request",
    "details": ["price must be positive number"]
  }
  `;
