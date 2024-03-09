from textblob import TextBlob

def rank_strings_by_sentiment(strings):
    sentiment_scores = [(text, TextBlob(text).sentiment.polarity) for text in strings]
    ranked_strings = sorted(sentiment_scores, key=lambda x: x[1])
    return ranked_strings

# Example list of strings
strings = [
    "I hate Mondays.",
    "The weather is nice today.",
    "I feel neutral about this movie.",
    "I love spending time with my family.",
    "The food at that restaurant was terrible."
]

# Rank strings by sentiment
ranked_strings = rank_strings_by_sentiment(strings)

# Print ranked strings
for text, score in ranked_strings:
    print(f"{text} => Sentiment Score: {score}")