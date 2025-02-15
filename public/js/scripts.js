function copyDonationLink() {
    const referralCode = document.getElementById('referralCode').textContent.trim();
    const donationLink = `${window.location.origin}/donations/${referralCode}`;
    navigator.clipboard.writeText(donationLink)
        .then(() => alert('Donation link copied to clipboard!'))
        .catch(err => console.error('Error copying link:', err));
}

function shareOnWhatsApp() {
    const referralCode = document.getElementById('referralCode').textContent.trim();
    const donationLink = `${window.location.origin}/donations/${referralCode}`;
    const message = `Hi, I am raising funds for NayePankh Foundation. Please support me by donating through this link: ${donationLink} and make a difference!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
}
