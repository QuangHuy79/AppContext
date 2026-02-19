// src/domainHost/domainHost.contract.js

/**
 * DOMAIN ↔ CORE CONTRACT
 * - Core chỉ giao tiếp với Domain thông qua interface này
 * - Domain KHÔNG được chạm Core runtime, snapshot, internal state
 * - Không chứa logic, chỉ là shape + rule
 */

export const DomainHostContract = Object.freeze({
  /**
   * Khởi tạo domain
   * @param {object} ctx - context do Core cấp (read-only)
   */
  init(ctx) {
    throw new Error("DomainHostContract.init is not implemented");
  },

  /**
   * Huỷ domain (cleanup)
   */
  destroy() {
    throw new Error("DomainHostContract.destroy is not implemented");
  },

  /**
   * Nhận event từ Core
   * @param {object} event
   */
  onEvent(event) {
    throw new Error("DomainHostContract.onEvent is not implemented");
  },

  /**
   * Public API domain expose cho Core gọi
   * KHÔNG được trả reference Core
   */
  getPublicAPI() {
    throw new Error("DomainHostContract.getPublicAPI is not implemented");
  },
});
