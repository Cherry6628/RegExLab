package model.pojo;
import java.io.Serializable;
import java.util.List;
public class Quiz implements Serializable{
	private static final long serialVersionUID = 1L;
	int qid;
	int topicId;
	public int getQid() {
		return qid;
	}
	public void setQid(int qid) {
		this.qid = qid;
	}
	public int getTopicId() {
		return topicId;
	}
	public void setTopicId(int topicId) {
		this.topicId = topicId;
	}
	public String getHeadline() {
		return headline;
	}
	public void setHeadline(String headline) {
		this.headline = headline;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getQuestion() {
		return question;
	}
	public void setQuestion(String question) {
		this.question = question;
	}
	public String getLanguage() {
		return language;
	}
	public void setLanguage(String language) {
		this.language = language;
	}
	public boolean isCode() {
		return isCode;
	}
	public void setCode(boolean isCode) {
		this.isCode = isCode;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public int getCorrectIndex() {
		return correctIndex;
	}
	public void setCorrectIndex(int correctIndex) {
		this.correctIndex = correctIndex;
	}
	public List<String> getOptions() {
		return options;
	}
	public void setOptions(List<String> options) {
		this.options = options;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	String headline;
	String description;
	String question;
	String language;
	boolean isCode;
	String code;
	int correctIndex;
	List<String> options;
	public Quiz(int qid, int topicId, String headline, String description, String question, String language,boolean isCode, String code, List<String> options) {
		this.qid = qid;
		this.topicId = topicId;
		this.headline = headline;
		this.description = description;
		this.question = question;
		this.language = language;
		this.isCode = isCode;
		this.code = code;
		this.options = options;
	}
}