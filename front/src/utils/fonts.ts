import { Cairo } from 'next/font/google';
import { Inter } from 'next/font/google';

const cairo = Cairo({
    subsets: ['latin'],
    weight: ['400', '700'],
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '700'],
});

export { cairo, inter };