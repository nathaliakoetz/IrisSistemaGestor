import { Cairo } from 'next/font/google';
import { Inter } from 'next/font/google';

const cairo = Cairo({
    subsets: ['latin'],
    weight: ['200', '300', '400', '500','600', '700', '800'],
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500','600', '700', '800'],
});

export { cairo, inter };