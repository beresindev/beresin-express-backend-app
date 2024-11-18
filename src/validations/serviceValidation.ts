export const serviceValidationInput = (input: {
    name_of_service?: string;
    category_id?: string | number;
    description?: string;
    min_price?: string;
    max_price?: string;
}) => {
    const errors: string[] = [];

    if (!input.name_of_service) errors.push('Nama Jasa tidak boleh kosong.');
    if (!input.category_id) errors.push('Kategori harus dipilih.');
    if (!input.description) errors.push('Deskripsi tidak boleh kosong.');
    if (!input.min_price || isNaN(parseCurrency(input.min_price))) {
        errors.push('Harga minimum harus berupa angka dan tidak boleh kosong.');
    }
    if (!input.max_price || isNaN(parseCurrency(input.max_price))) {
        errors.push('Harga maksimum harus berupa angka dan tidak boleh kosong.');
    }
    if (
        input.min_price &&
        input.max_price &&
        parseCurrency(input.min_price) > parseCurrency(input.max_price)
    ) {
        errors.push('Harga maksimum tidak boleh lebih rendah dari harga minimum.');
    }

    return errors;
};

export const parseCurrency = (value: string): number => {
    return parseInt(value.replace(/\./g, ''), 10);
};
