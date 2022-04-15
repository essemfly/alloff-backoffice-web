import { ReceivedItemStatusEnum } from "@lessbutter/alloff-backoffice-api";

export const getStatusLabel = (status: ReceivedItemStatusEnum) => {
    switch (status) {
        case ReceivedItemStatusEnum.OnReceiving:
            return "입고중";
        case ReceivedItemStatusEnum.OutOfStock:
            return "취소 (재고부족)";
        case ReceivedItemStatusEnum.Canceled:
            return "취소 (고객/관리자 취소)";
        case ReceivedItemStatusEnum.Reverted:
            return "취소 (재고원복처리)";
        case ReceivedItemStatusEnum.Received:
            return "입고완료";
            
    }
}