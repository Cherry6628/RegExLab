package model.pojo;
public class Option {
	int oid;
	int quizId;
	String option;
	int order;
	public Option(int oid, int quizId, String option, int order) {
		super();
		this.oid = oid;
		this.quizId = quizId;
		this.option = option;
		this.order = order;
	}
}