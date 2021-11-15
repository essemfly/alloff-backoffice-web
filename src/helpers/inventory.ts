import { InventoryStatusEnum } from "../api";

export const getInventoryStatusLabel = (status: InventoryStatusEnum) => {
    switch (status) {
        case InventoryStatusEnum.InStock:
            return "재고있음";
        case InventoryStatusEnum.Shipped:
            return "출고됨";
        case InventoryStatusEnum.ShippingPending:
            return "출고대기";
        case InventoryStatusEnum.ProcessingNeeded:
            return "처리필요";
        default:
            return "UNKNOWN";
    }

}