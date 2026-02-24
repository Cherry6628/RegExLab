package model.pojo;
import java.util.List;
public class Quiz {
	int qid;
	int topicId;
	String headline;
	String description;
	String question;
	String language;
	boolean isCode;
	String code;
	int correctIndex;
	List<String> options;
	public Quiz(int qid, int topicId, String headline, String description, String question, String language,boolean isCode, String code, int correctIndex, List<String> options) {
		this.qid = qid;
		this.topicId = topicId;
		this.headline = headline;
		this.description = description;
		this.question = question;
		this.language = language;
		this.isCode = isCode;
		this.code = code;
		this.correctIndex = correctIndex;
		this.options = options;
	}
}