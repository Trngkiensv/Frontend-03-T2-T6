import { useEffect, useState } from "react";
import axios from "axios";

export default function useAPI<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        let isActive = true;
        setData(null);
        setLoading(true);
        setError(null);
        axios(url)
            .then((response) => {
                if (isActive) {
                    setData(response.data);
                }
            })
            .catch((err) => {
                if (isActive) {
                    setError(err.message || "Không tải được dữ liệu.");
                }
            })
            .finally(() => {
                if (isActive) {
                    setLoading(false);
                }
            });
        return () => {
            isActive = false;
        };
    }, [url]);
    return { data, error, loading };
}
