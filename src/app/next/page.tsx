import {Test} from "@/components/Test/Test";

export default function Next() {
    const cryptoLink = process.env.CRYPTO_LINK
    const buyLink = process.env.BUY_LINK

    console.log(
        'cryptoLink',
        cryptoLink,
        'buyLink',
        buyLink)
    return (
<>
<div>NEXT</div>
    {cryptoLink && buyLink && <Test crypto={cryptoLink} buy={buyLink}/>
    }
</>
    );
};
